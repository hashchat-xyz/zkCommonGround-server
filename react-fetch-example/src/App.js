import React, { useRef, useState } from "react";
import './App.css';

function App() {
  const baseURL = "http://127.0.0.1:5000/";

  const get_bid = useRef(null);
  const get_sid = useRef(null);

  const pk_e = useRef(null);
  const pk_n = useRef(null);

  const c = useRef(null);
  const n = useRef(null);

  const z = useRef(null);
  const p = useRef(null);

  const [getResult, setGetResult] = useState(null);
  const [postResult, setPostResult] = useState(null);
  const [postResultCN, setPostResultCN] = useState(null);
  const [postResultZ, setPostResultZ] = useState(null);

  const fortmatResponse = (res) => {
    return JSON.stringify(res, null, 2);
  }

  async function getBuyerpk() {
    try {
      const res = await fetch(`${baseURL}/buyer/pubkey`);

      if (!res.ok) {
        const message = `An error has occured: ${res.status} - ${res.statusText}`;
        throw new Error(message);
      }

      const data = await res.json();
      // console.log(data);

      const result = {
        status: res.status + "-" + res.statusText,
        headers: {
          "Content-Type": res.headers.get("Content-Type"),
          "Content-Length": res.headers.get("Content-Length"),
        },
        length: res.headers.get("Content-Length"),
        data: data,

      };

      setGetResult(fortmatResponse(result));
    } catch (err) {
      setGetResult(err.message);
    }
  }

  async function setBuyerPrice() {
    const id = get_bid.current.value;

    if (id) {
      try {
        const res = await fetch(`${baseURL}/buyer/${id}`);

        if (!res.ok) {
          const message = `An error has occured: ${res.status} - ${res.statusText}`;
          throw new Error(message);
        }

        const data = await res.json();

        const result = {
          data: data,
          status: res.status,
          statusText: res.statusText,
          headers: {
            "Content-Type": res.headers.get("Content-Type"),
            "Content-Length": res.headers.get("Content-Length"),
          },
        };

        setGetResult(fortmatResponse(result));
      } catch (err) {
        setGetResult(err.message);
      }
    }
  }


  async function setSellerPrice() {
    const id = get_sid.current.value;

    if (id) {
      try {
        const res = await fetch(`${baseURL}seller/${id}`);

        if (!res.ok) {
          const message = `An error has occured: ${res.status} - ${res.statusText}`;
          throw new Error(message);
        }

        const data = await res.json();

        const result = {
          data: data,
          status: res.status,
          statusText: res.statusText,
          headers: {
            "Content-Type": res.headers.get("Content-Type"),
            "Content-Length": res.headers.get("Content-Length"),
          },
        };

        setGetResult(fortmatResponse(result));
      } catch (err) {
        setGetResult(err.message);
      }
    }
  }



  async function postData() {
    const postData = {
      publickeye: pk_e.current.value,
      publickeyn: pk_n.current.value,
    };

    try {
      const res = await fetch(`${baseURL}seller/getcn`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": "token-value",
        },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const message = `An error has occured: ${res.status} - ${res.statusText}`;
        throw new Error(message);
      }

      const data = await res.json();

      const result = {
        status: res.status + "-" + res.statusText,
        headers: {
          "Content-Type": res.headers.get("Content-Type"),
          "Content-Length": res.headers.get("Content-Length"),
        },
        data: data,
      };

      setPostResult(fortmatResponse(result));
    } catch (err) {
      setPostResult(err.message);
    }
  }

  async function postDataCN() {
    const postData = {
      cval: c.current.value,
      nval: n.current.value,
    };

    try {
      const res = await fetch(`${baseURL}buyer/getz`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": "token-value",
        },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const message = `An error has occured: ${res.status} - ${res.statusText}`;
        throw new Error(message);
      }

      const data = await res.json();

      const result = {
        status: res.status + "-" + res.statusText,
        headers: {
          "Content-Type": res.headers.get("Content-Type"),
          "Content-Length": res.headers.get("Content-Length"),
        },
        data: data,
      };

      setPostResultCN(fortmatResponse(result));
    } catch (err) {
      setPostResultCN(err.message);
    }
  }

  async function postDataZ() {
    const postData = {
      zval: z.current.value,
      pval: p.current.value
    };
    
    try {
      const res = await fetch(`${baseURL}seller/deal_or_nodeal`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": "token-value",
        },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const message = `An error has occured: ${res.status} - ${res.statusText}`;
        throw new Error(message);
      }

      const data = await res.json();

      const result = {
        status: res.status + "-" + res.statusText,
        headers: {
          "Content-Type": res.headers.get("Content-Type"),
          "Content-Length": res.headers.get("Content-Length"),
        },
        data: data,
      };

      setPostResultZ(fortmatResponse(result));
    } catch (err) {
      setPostResultZ(err.message);
    }
  }


  const clearPostOutput = () => {
    setPostResult(null);
  }
  const clearPostOutputCN = () => {
    setPostResultCN(null);
  }
  const clearPostOutputZ = () => {
    setPostResultZ(null);
  }

  return (
    <div id="app" className="container my-3">
      <h3>React Fetch Tests for zkCommonGround</h3>

      <div className="card mt-3">
        <div className="card-header">React Fetch GET</div>
        <div className="card-body">
        <button className="btn btn-sm btn-primary" onClick={getBuyerpk}>Get Buyer PK</button>

          <div className="input-group input-group-sm">

            <input type="text" ref={get_bid} className="form-control ml-2" placeholder="bId" />
            <div className="input-group-append">
              <button className="btn btn-sm btn-primary" onClick={setBuyerPrice}>Set Buyers Price</button>
            </div>
            <input type="text" ref={get_sid} className="form-control ml-2" placeholder="sId" />
            <div className="input-group-append">
              <button className="btn btn-sm btn-primary" onClick={setSellerPrice}>Set Sellers Price</button>
            </div>
            
          </div>
          
          { getResult && <div className="alert alert-secondary mt-2" role="alert"><pre>{getResult}</pre></div> }
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-header">Post Public Key to Seller</div>
        <div className="card-body">
          <div className="form-group">
            <input type="text" className="form-control" ref={pk_e} placeholder="Public Key e" />
          </div>
          <div className="form-group">
            <input type="text" className="form-control" ref={pk_n} placeholder="Public Key n" />
          </div>
          <button className="btn btn-sm btn-primary" onClick={postData}>Post Data for C N outputs</button>
          <button className="btn btn-sm btn-warning ml-2" onClick={clearPostOutput}>Clear</button>

          { postResult && <div className="alert alert-secondary mt-2" role="alert"><pre>{postResult}</pre></div> }
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-header">Post C N to buyer</div>
        <div className="card-body">
          <div className="form-group">
            <input type="text" className="form-control" ref={c} placeholder="c component" />
          </div>
          <div className="form-group">
            <input type="text" className="form-control" ref={n} placeholder="N" />
          </div>
          <button className="btn btn-sm btn-primary" onClick={postDataCN}>Post C N to buyer</button>
          <button className="btn btn-sm btn-warning ml-2" onClick={clearPostOutputCN}>Clear</button>

          { postResultCN && <div className="alert alert-secondary mt-2" role="alert"><pre>{postResultCN}</pre></div> }
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-header">Post Z to seller for answer</div>
        <div className="card-body">
          <div className="form-group">
            <input type="textarea" className="form-control" ref={z} placeholder="z array in json form {data:['4432','234']}" />
          </div>
          <div className="form-group">
            <input type="text" className="form-control" ref={p} placeholder="p" />
          </div>
          <button className="btn btn-sm btn-primary" onClick={postDataZ}>Post Z P to Seller for Answer</button>
          <button className="btn btn-sm btn-warning ml-2" onClick={clearPostOutputZ}>Clear</button>

          { postResultZ && <div className="alert alert-secondary mt-2" role="alert"><pre>{postResultZ}</pre></div> }
        </div>
      </div>


 
    </div>
  );
}

export default App;
