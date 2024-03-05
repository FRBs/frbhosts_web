import React from "react";
import LatexComponent from "./latex";

<script>
var decl = props.data["Host Decl."].includes('-')? props.data["Host Decl."] : "+"+props.data["Host Decl."];
document.getElementById('declHolder').innerHTML = str;
</script>

const Details = (props) => {
  // Replace "github.com" with "raw.githubusercontent.com"
  var originalUrl = props.data.image;
  var modifiedUrl = originalUrl.replace("github.com", "raw.githubusercontent.com");

  // Links start
  var props.data.decl= {(props.data["Host Decl."].includes('-')) ? {props.data["Host Decl."]} : {"+"+props.data["Host Decl."]}}
  var link = `https://ps1images.stsci.edu/cgi-bin/ps1cutouts?pos=${props.data["Host R.A."]}${props.data.decl}&filter=color&filter=g&filter=r&filter=i&filter=z&filter=y&filetypes=stack&auxiliary=data&size=240&output_size=0&verbose=0&autoscale=99.500000&catlist=`;
  var tns_link = `https://www.wis-tns.org/object/${props.data.FRB.split('FRB')[1]}`;

  // Remove "/blob" from the path
  modifiedUrl = modifiedUrl.replace("/blob", "");
  return (
    <div className="w-100 bg-light" style={{ height: "100vh" }} data-aos="fade-in">
      <button
        className="btn-lg btn rounded-circle btn-outline-dark text-align-center d-flex align-items-center"
        onClick={() => props.off([])}
        style={{ height: "50px", width: "50px", position: "absolute", top: "2%", left: "3%" }}
      >
        <i className="fa fa-arrow-left"></i>
      </button>
      <div className="container pt-5" data-aos="fade-up" data-aos-delay="200">
        <div className="row ">
          <div className="col-7">
            <h3 className="text-dark display-6 fw-bold pb-4">{props.data.FRB}</h3>

            <h4 className="text-dark mt-2">R.A./Decl (2000) </h4>
            <p className="text-secondary text-lead fs-5">
              {props.data["Host R.A."]}/{props.data.decl}
            </p>

            <h4 className="text-dark mt-2">Redshift</h4>
            <p className="text-secondary text-lead fs-5">{props.data.redshift}</p>

            <h4 className="text-dark mt-2">Offset (arcsec)</h4>
            <p className="text-secondary text-lead fs-5">{props.data["Offset ($\u0007rcsec$)"]}</p>
          </div>
          <div className="col-5">
            <img className="shadow rounded" src={modifiedUrl} style={{ height: "500px", width: "100%", objectFit: "contain" }} loading="lazy" />

            <div className="w-100 pt-4 d-flex justify-content-between">
              <a className="btn-info btn-lg btn rounded shadow me-2 w-100" href={tns_link} target="_blank">
                TNS
              </a>
              <a className="btn-danger  btn-lg btn rounded shadow w-100" href={link} target="_blank">
                PanSTARRS
              </a>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <h3 className="text-dark mt-2 display-6 fw-bold pb-4">Host Properties</h3>
          </div>
          <div className="col-12 d-lg-flex justify-content-between">
            <div className="w-100 me-2 mb-3">
              <h4 className="text-dark ">
                <LatexComponent text="$m_r$" />
              </h4>
              <p className="text-secondary text-lead fs-5">{props.data["$m_r$."]}</p>
            </div>

            <div className="w-100 me-2 mb-3">
              <h4 className="text-dark ">
                <LatexComponent text="$M_*$ ($\rm M_{\odot}$)" />
              </h4>
              <p className="text-secondary text-lead fs-5">{props.data["$M_*$ ($\rm M_{\\odot}$)"].toExponential()}</p>
            </div>

            <div className="w-100 me-2 mb-3">
              <h4 className="text-dark ">
                <LatexComponent text="SFR ($\rm M_{\odot}$/yr)" />
              </h4>
              <p className="text-secondary text-lead fs-5">{props.data["SFR ($\rm M_{\\odot}$\\yr)"]}</p>
            </div>

            <div className="w-100 me-2 mb-3">
              <h4 className="text-dark ">
                <LatexComponent text="$Z_{\rm gas}$ ($Z_{\odot}$)" />
              </h4>
              <p className="text-secondary text-lead fs-5">{props.data["$Z_{\rm gas}$ ($Z_{\\odot}$)"]}</p>
            </div>

            <div className="w-100 me-2 mb-3">
              <h4 className="text-dark ">
                <LatexComponent text="$t_{m}$ (Gyr)" />
              </h4>
              <p className="text-secondary text-lead fs-5">{props.data["$t_{m}$ (Gyr)"]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
