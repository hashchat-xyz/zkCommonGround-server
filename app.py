from cgi import print_exception
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)


import random
import time
from Crypto.PublicKey import RSA
from Crypto.Util import number

# Input global range 
r1 = 1
r2 = 20

def encryptDecrypt(message,key):
    c = pow(message,key[0],key[1])
    return c

class Seller:
    def __init__(self, max_price=10, num_bits=1024):
        self.max_price = max_price
        self.num_bits = num_bits
        self.m1 = 0

    def set_price(self,num_price):
      self.price = num_price
      return True

    def get_c(self, pubkey):
        # SEND PUBLIC KEY TO Sally AND [e,n]
        ''' Send publicKeyBob
        Sally Compute C = E(PUb, M1), M1 -- a large random number
        Compute C1 = C – x and sends C1 to Bob
        '''
        publicKeyBuyer = pubkey
        n = publicKeyBuyer[1]
        N = n.bit_length()
        # choose random M1
        m1= random.getrandbits(N)
        while m1 >= n:
            m1 = random.getrandbits(N)
        N = m1.bit_length()

        # Sally encrypts m1 using publicKeyBob RSA
        self.m1 = m1
        c = encryptDecrypt(m1,publicKeyBuyer)

        #Sally sends C=C-x to Bob.  NOTE Sally's secret is x
        #END Sally (send c to bob), 
        c = c-self.price
        return c, N

    def deal_or_nodeal(self,z, prime):
        # BOB SENDS array z[] to Sally. Sally secret x = self.price:
        ''' Sally recevies sequence z[]
        Select z[x] , Check  if z[x] = m1 mod prime'''
        m1 = self.m1
        x = self.price
        quiet = False

        if(m1%prime == z[x-1]):
            if not quiet: print("y >= x") # Bob's secret is greater than or equal to Sally's secret
            if not quiet: print("DEAL:  Bobs offer to buy is greater than or equal to Sallys lowest acceptable offer")
            return(True)
        else:
            if not quiet: print("x > y") # Sally's secret is greater than Bob's secret"
            if not quiet: print("NO DEAL: Sallys lowest acceptable offer is higher than Bob\'s Highest buy price")
            return(False)

# BUYER FUNCTIONS
class Buyer:
    def __init__(self, max_price=10, num_bits=1024):
        self.max_price = max_price
        self.num_bits = num_bits
    
    def send_pubkey(self):
        self.key = RSA.generate(self.num_bits)
        self.publicKey = [self.key.e, self.key.n]
        self.privateKey = [self.key.d, self.key.n]

        return [str(self.key.e), str(self.key.n)]

    def set_price(self, num_price):
      self.price = num_price
      return True

    def get_z_array(self,c, N):
        #BEGIN BOB (secret y)
        # 3. Bob computes M2 i = D(PRb,C1+i), for r1<= i <=r2
        rangeN = r2+r1-1
        n = [0]*(rangeN+1)

        for i in range(1, len(n)):
            n[i] = encryptDecrypt(c+i,self.privateKey)

        m = n[1:]
        # 4. Choose a large prime p (<M1); Bob can know the size of M1

        primes = [0]*(rangeN)
        for i in range(len(primes)):
            # print(i)
            primes[i] = number.getPrime(N-1) #returns random prime

        # 5. Compute Z i = M2 i mod p, 1<=i<100
        z= [0]*(rangeN)
        prime = random.choice(primes)
        primes.remove(prime)

        for i in range(0, len(m)):
            z[i] = m[i]%prime
        condt=0

        '''Verify if |Z i – Z j | >= 2 for all (i,j) and 0 < Z i < p-1, for all i,
        otherwise try another prime and repeat from step-4 '''
        while condt == 0:
            for i in range(0, len(m)):
                for j in range(i+1 , len(m)):
                    if( abs(z[i]-z[j]) < 2):
                        condt=0
            if condt == 1:
                for i in range(0,len(m)):
                    if(z[i]>=prime or z[i]<=0):
                        condt=0
            if condt == 0:
                if primes:
                    prime = random.choice(primes)
                # If conditions fails repeat the process
                    primes.remove(prime)
                    for i in range(0,len(m)):
                        z[i]=m[i]%prime
                else:
                    break
        # sequence
        for i in range(self.price,len(z)):
            z[i]=z[i]+1

        return z, prime

@app.route('/')
def index():
    return 'Index Page'


# adding variables
#global buyer

buyer = Buyer()

@app.route('/buyer/pubkey')
@cross_origin(origin='*')
def send_pubkey():
    spk = buyer.send_pubkey()
    response = jsonify(spk)
    return response


@app.route('/buyer/<int:bprice>')
@cross_origin(origin='*')
def init_buyer(bprice):
    return jsonify(buyer.set_price(bprice))

seller = Seller()

@app.route('/seller/<int:sprice>')
@cross_origin(origin='*')
def init_seller(sprice):
    # returns test calls
    return jsonify(seller.set_price(sprice))

@app.route('/seller/getcn', methods=['POST'])
@cross_origin(origin='*')
def seller_cn():
    # returns c and n
    res = request.get_json()
    # pubkeye, pubkeyn
    pubkey = [int(res['publickeye']), int(res['publickeyn'])]
    [c,n]=seller.get_c(pubkey)
    response = jsonify([str(c),str(n)])
    return response

@app.route('/buyer/getz', methods=['POST'])
@cross_origin(origin='*')
def calczp():
    res = request.get_json()
    c = int(res['cval'])
    n = int(res['nval'])
    z, p = buyer.get_z_array(c,n)
    zstr = ["" for x in range(len(z))]
    for i in range(len(z)):
      zstr[i]=str(z[i])
    return jsonify(zstr, str(p))

@app.route('/seller/deal_or_nodeal', methods=['POST'])
@cross_origin(origin='*')
def deal_or_no():
    res = request.get_json()
    # print(res)
    z = json.loads(res['zval'])

    p = int(res['pval'])  # works
    print(p)

    zi = [0] * len(z)
    # this is a long array of integers in string form, conver to ints
    for i in range(len(z)):
      zi[i] = int(z[i])
    print(zi)
    return jsonify(seller.deal_or_nodeal(zi,p))

@app.route('/runseller/<int:x>')
@cross_origin(origin='*')
def runseller(x):
    msg = ''

    # buyer = Buyer()
    # buyer.set_price(y) #secret!
    if buyer.price < r1 or buyer.price >r2:
        msg = "buyer must set price first" 
        exit

    seller = Seller()
    seller.set_price(x)  # secret!

    pubkey = buyer.send_pubkey()
    # print(pubkey)
    pubkey[0]= int(pubkey[0])
    pubkey[1] = int(pubkey[1])
    c, N = seller.get_c(pubkey)
    # print (c,N)
    z, prime = buyer.get_z_array(c,N)
    # print(z,prime)
    result = seller.deal_or_nodeal(z, prime)

    if result:
        msg = "DEAL"
    else:
        msg = "NO DEAL"

    return msg

@app.route('/runtest/<int:x>/<int:y>')
@cross_origin(origin='*')
def fulltest(x,y):
    msg = ''
    if x<r1 or x>r2 or y<r1 or y>r2:
        msg = "error outside of ranges"
        exit

    buyer = Buyer()
    buyer.set_price(y) #secret!
    seller = Seller()
    seller.set_price(x)  # secret!

    pubkey = buyer.send_pubkey()

    c, N = seller.get_c(pubkey)

    z, prime = buyer.get_z_array(c,N)

    result = seller.deal_or_nodeal(z, prime)

    if (x>y and result) or (x<y and not result) or (x==y and not result) :
        msg = "PASSED"
    else:
        msg = "failed"

    return str(msg.get_json(force=True))


if __name__ == '__main__':
  app.run()