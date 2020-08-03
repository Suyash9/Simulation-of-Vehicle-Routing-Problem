import React from 'react';
import './appStyle.css';
import { addVehicle } from './javascript_functions/addVehicle.js';
import { getVehicles } from './javascript_functions/getVehicles';
import { addLocation } from './javascript_functions/addLocation';
import { getLocations } from './javascript_functions/getLocations';
import { deleteVehicle } from './javascript_functions/deleteVehicle';
import { deleteLocation } from './javascript_functions/deleteLocation';
import { editVehicle } from './javascript_functions/editVehicle';
import { editLocation } from './javascript_functions/editLocation';
import { getAlgorithms } from './javascript_functions/getAlgorithms';
import { getParameters, getNumParameters, setAlgorithm, setCurrentAlgo } from './javascript_functions/getParameters';
import { addAlgorithm } from './javascript_functions/addAlgorithm';
import { deleteAlgorithm } from './javascript_functions/deleteAlgorithm';
import { runAlgorithm, setParameters} from './javascript_functions/runAlgorithm';
import { deleteAllVehicles } from './javascript_functions/deleteAllVehicles';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAllCapacities } from './javascript_functions/getAllCapacities';
import { deleteAllLocations } from './javascript_functions/deleteAllLocations';

class App extends React.Component {
  render(){
    return (
        <div className="grid">
          <div className="vehicle">
            <h1 style={{"margin-left": "20%","margin-top":"2%"}}>Vehicle Management</h1>
            
            <button id="add_vehicle" className="veh_btn" style={{"background-color":"#3385FF", "margin-left":"5%"}}>Add Vehicle</button>
            <div id="modal_vehicle" className="modal_veh">
              <div className="modal-content">
                <span className="close_veh">&times;</span>
                <form id="add_vehicle_box" className="add_modal">
                  <h1>New Vehicle</h1>

                  <label><b>Vehicle Name</b></label>
                  <input id="new_veh_name" type="text" placeholder="Enter Vehicle Name" autocomplete="off"/>

                  <label><b>Capacity</b></label>
                  <input id="new_veh_cap" type="number" placeholder="Enter Capacity"  autocomplete="off"/>

                  <button id="add_veh_submit" type="submit" class="btn">Add Vehicle</button>
                </form>
              </div>
            </div>


            <button id="edit_veh" className="veh_btn" style={{"background-color":"#FFA100"}}>Edit Vehicle</button>
            <div id="model_edit_veh" className="modal_veh">
              <div className="modal-content">
                <span className="close_veh">&times;</span>
                <form id="edit_vehicle_box" className="add_modal">
                  <h1>Edit Vehicle</h1>

                  <label><b>Vehicle Name</b></label>
                  <input id="edit_veh_name" type="text" autocomplete="off"/>

                  <label><b>Capacity</b></label>
                  <input id="edit_veh_cap" type="number" autocomplete="off"/>

                  <button id="edit_veh_submit" type="submit" class="btn">Done</button>
                </form>
              </div>
            </div>
            <div style={{"margin-left":"69%", "margin-top":"8%"}}>
              <button id="del_veh" className="veh_btn">Delete Vehicle</button>
            </div>
            <button id="del_all_veh" className="veh_btn" style={{"margin-left":"70.5%","margin-top":"5%", height:"40px", width:"140px"}}>Delete <br></br> All Vehicles</button>
            <div id="vehicles" className="select_box" style={{width: "23.5%","margin-top":"-27%","margin-bottom":"1%"}}>
              <select class="select_empty" size="2">
                <option value="0" disabled>Loading Vehicles</option>
              </select>
            </div>
          </div>

          <div className="location">
          <h1 style={{"margin-left": "18%","margin-top":"2%"}}>Location Management</h1>

            <button id="add_loc" className="loc_btn" style={{"background-color":"#3385FF", "margin-left":"5%"}}>Add Location</button>
            <div id="modal_loc" className="modal_loc">
              <div className="modal-content">
                <span className="close_loc">&times;</span>
                <form id="add_loc_box" className="add_modal">
                  <h1>New Location</h1>

                  <label><b>X Coordinate</b></label>
                  <input id="new_loc_x"type="number" placeholder="Enter X Coordinate" autocomplete="off"/>

                  <label><b>Y Coordinate</b></label>
                  <input id="new_loc_y" type="number" placeholder="Enter Y Coordinate" autocomplete="off"/>

                  <button id="add_loc_submit" type="submit" class="btn">Add Location</button>
                </form>
              </div>
            </div>

            <button id="edit_loc_btn"className="loc_btn" style={{"background-color":"#FFA100"}}>Edit Location</button>
            <div id="modal_loc" className="modal_loc">
              <div className="modal-content">
                <span className="close_loc">&times;</span>
                <form id="edit_loc_box" className="add_modal">
                  <h1>Edit Location</h1>

                  <label><b>X Coordinate</b></label>
                  <input id="edit_loc_x" type="number" autocomplete="off"/>

                  <label><b>Y Coordinate</b></label>
                  <input id="edit_loc_y" type="number" autocomplete="off"/>

                  <button id="edit_loc_submit" type="submit" class="btn">Done</button>
                </form>
              </div>
            </div>
            <div style={{"margin-left":"69%", "margin-top":"8%"}}>
              <button id="del_loc" className="loc_btn" >Delete Location</button>
            </div>
            <button id="del_all_loc"className="loc_btn" style={{"margin-left":"70.5%","margin-top":"5%", height:"40px", width:"140px"}}>Delete <br></br> All Locations</button>
            <div id="locations" className="select_box" style={{width: "23.5%","margin-top":"-27%","margin-bottom":"1%"}}>
              <select class="select_empty" size="2">
                <option value="0" disabled>Loading Locations</option>
              </select>
            </div>
          </div>

          <div className="algorithm">
          <h1 style={{"margin-left": "30%","margin-top":"2%", "margin-bottom":"1%"}} className="header">Vehicle Routing</h1>
            
            <div id="algo_section" style={{display:"inline", "margin-left":"-5.8%"}}>
              <select id="temp_algo" class="select_algo" disabled style={{width:"289px"}}>
                <option>Loading Algorithms</option>
              </select>
            </div>
            <div class="tooltip"><FontAwesomeIcon id="help_icon" onClick={() => openAlgoHelp()} icon={faQuestionCircle} className="help_icon"/>
              <span class="tooltiptext">Click for more information about the algorithms</span>
            </div>    
            <button id="para_btn" className="algo_btn" style={{"background-color":"#A700FF"}}>Parameters</button>
            <div id="modal_para" className="modal_para">
                <div className="modal-content">
                  <span className="close_para">&times;</span>
                  <form id="para_modal_form" className="add_modal"></form>
                  <button type="button" onClick={() => submitParameters()} class="para_submit">Submit Parameters</button>
                </div>
            </div>
            
            <div style={{"margin-left":"77%", "margin-top":"10%"}}>
              <button id="run_algo" className="algo_btn" style={{"background-color":"#3C9F40","margin-bottom":"30%"}}>Run Algorithm</button>
              <button id="reset_para" className="algo_btn" style={{"background-color":"black"}}>Reset <br></br>All Parameters</button>
            </div>

            <div style={{"margin-left":"77%", "margin-top":"12%"}}>
              <button id="add_algo" className="algo_btn" style={{"background-color":"#3385FF"}}>Add <br></br>New Algorithm</button>
              <div id="modal_addalgo" className="modal_addalgo">
                <div className="modal-content-add-algo">
                  <span className="close_add_algo">&times;</span>
                  <form id="new_algo_form">
                    <h1>Add Algorithm</h1>
                    <label for="algo_name"><b>Algorithm Name: </b></label>
                    <input id="algo_name" type="text" placeholder="Enter Algorithm Name" autocomplete="off" className="add_algo_name" style={{"margin-left":"11px"}} maxlength="31"/>
                    <br/>
                    <br/>
                    <label for="algo_para"><b>Parameter Names (Maximum 6): </b></label>
                    <input id="algo_para" type="text" autocomplete="off" placeholder="Enter comma seperated Parameter Names" className="add_algo_name"/>
                    <br/>
                    <br/>
                    <textarea id="new_algo" className="add_algo_text" placeholder="Enter Python algorithm here" autocomplete="off"></textarea>

                    <label for="algo_file" class="algo_upload_btn">Upload Python Algorithm</label>
                    <input id="algo_file" type="file" accept=".py, .txt" style={{visibility:"hidden"}}/>
                    <button id="new_algo_submit" type="submit" class="add_algo_btn">Submit Algorithm</button>
                  </form>
                </div>
              </div>
            </div>
            <div style={{display:"flex", "margin-left":"77%", "margin-top":"7%"}}>
              <button id="delete_algo" className="algo_btn">Delete Algorithm</button>
            </div>

            <div className="graph" id="graph">
              <div style={{"text-align":"center", "padding-top":"22.5%", "font-size":"large"}}>Graph of the routes will be displayed here.</div>
            </div>

            <div id="route" className="route">
              <div style={{"text-align":"center", "padding-top":"17.5%", "font-size":"large"}}>Solution route will be displayed here.</div>
            </div>
          </div>
        </div>
    );
  }
}

window.onload = function(){
  var modal_veh = document.getElementsByClassName("modal_veh");
  var btn_veh = document.getElementsByClassName("veh_btn");
  var span_veh = document.getElementsByClassName("close_veh");

  btn_veh[0].onclick = function() {
    modal_veh[0].style.display = "block";
  }

  btn_veh[1].onclick = function() {
    if (document.getElementById("veh_list").value==""){
      alert("Please select a vehicle to edit.");
    }else{
      modal_veh[1].style.display = "block";
      var selected = document.getElementById("veh_list");
      var vehicle_name = selected.options[selected.selectedIndex].text.split(" ");
      document.getElementById("edit_veh_name").value = vehicle_name[0];
      document.getElementById("edit_veh_cap").value = vehicle_name[1].replace(/[{()}]/g, '');
    }
  }

  span_veh[0].onclick = function() {
    modal_veh[0].style.display = "none";
    document.getElementById("new_veh_name").value = "";
    document.getElementById("new_veh_cap").value = "";
    getVehicles();
  }

  span_veh[1].onclick = function() {
    modal_veh[1].style.display = "none";
    getVehicles();
  }
  
  var modal_loc = document.getElementsByClassName("modal_loc");
  var btn_loc = document.getElementsByClassName("loc_btn");
  var span_loc = document.getElementsByClassName("close_loc");

  btn_loc[0].onclick = function() {
    modal_loc[0].style.display = "block";
  }

  btn_loc[1].onclick = function() {
    if (document.getElementById("loc_list").value==""){
      alert("Please select a location to edit.");
    }else{
      modal_loc[1].style.display = "block";
      var selected = document.getElementById("loc_list");
      var option = selected.options[selected.selectedIndex].text.split(",");
      document.getElementById("edit_loc_x").value = option[0].split('(')[1];
      document.getElementById("edit_loc_y").value = option[1].split(')')[0].trim();
    }
  }

  span_loc[0].onclick = function() {
    modal_loc[0].style.display = "none";
    document.getElementById("new_loc_x").value = "";
    document.getElementById("new_loc_y").value = "";
    getLocations();
  }

  span_loc[1].onclick = function() {
    modal_loc[1].style.display = "none";
    getLocations();
  }
  
  var modal_para = document.getElementById("modal_para");
  var btn_para = document.getElementById("para_btn");
  var span_para = document.getElementsByClassName("close_para")[0];

  btn_para.onclick = function() {
    var selected = document.getElementById("algo_list");
    if (selected.value == "none"){
      alert("Please select an algorithm.")
    }
  }

  span_para.onclick = function() {
    modal_para.style.display = "none";
  }

  var modal_add_algo = document.getElementById("modal_addalgo");
  var btn_add_algo = document.getElementById("add_algo");
  var span_add_algo = document.getElementsByClassName("close_add_algo")[0];

  btn_add_algo.onclick = function() {
    modal_add_algo.style.display = "block";
  }

  span_add_algo.onclick = function() {
    modal_add_algo.style.display = "none";
    document.getElementById("algo_name").value = "";
    document.getElementById("algo_para").value = "";
    document.getElementById("new_algo").value = "";
  }

  window.onclick = function(event) {
    if (event.target == modal_veh[0]) {
      modal_veh[0].style.display = "none";
    } else if (event.target == modal_veh[1]){
      modal_veh[1].style.display = "none";
    } else if (event.target == modal_loc[0]){
      modal_loc[0].style.display = "none";
    } else if (event.target == modal_loc[1]){
      modal_loc[1].style.display = "none";
    } else if (event.target == modal_para){
      modal_para.style.display = "none";
    } else if (event.target == modal_add_algo){
      modal_add_algo.style.display = "none";
    }
  }

  // Event Listeners
  document.getElementById('algo_file').addEventListener('change', handleFileSelect, false);

  document.getElementById('add_veh_submit').addEventListener('click', addVehicle);
  getVehicles();
  getAllCapacities();

  document.getElementById('add_loc_submit').addEventListener('click', addLocation);
  getLocations();

  document.getElementById('edit_veh_submit').addEventListener('click', editVehicle);

  document.getElementById('edit_loc_submit').addEventListener('click', editLocation);

  document.getElementById('del_veh').addEventListener('click', deleteVehicle);
  
  document.getElementById('del_loc').addEventListener('click', deleteLocation);

  getAlgorithms();

  document.getElementById('para_btn').addEventListener('click', getParameters);

  document.getElementById('new_algo_submit').addEventListener('click', addAlgorithm);

  document.getElementById('delete_algo').addEventListener('click', deleteAlgorithm);

  document.getElementById('run_algo').addEventListener('click', runAlgorithm);

  document.getElementById('del_all_veh').addEventListener('click', deleteAllVehicles);

  document.getElementById("del_all_loc").addEventListener('click', deleteAllLocations);

  document.getElementById("reset_para").addEventListener('click', () => setCurrentAlgo(" "));
}

function handleFileSelect(event){
  const reader = new FileReader();
  reader.onload = handleFileLoad;
  reader.readAsText(event.target.files[0]);
}

function handleFileLoad(event){
  document.getElementById('new_algo').value = event.target.result;
}

function openAlgoHelp(){
  window.open("https://vrpalgorithmhelptable.z33.web.core.windows.net/");
}

function submitParameters(){
  let num_parameters = getNumParameters();
  var parameters = [];
  var null_flag = true;
  for (let i = 0; i < num_parameters; i++) {
    var para = {};
    var id = "para" + i.toString();
    var para_value = document.getElementById(id).value;
    if (para_value == ""){
      null_flag = false;
    }else{
      para[id] = para_value;
      parameters.push(para);
    }
  }

  if(null_flag == false){
    alert("Please enter all parameters");
    parameters = [];
  }else{
    var modal_para = document.getElementById("modal_para");
    modal_para.style.display = "none";
    setParameters(parameters);

    var selected = document.getElementById("algo_list");
    setAlgorithm(selected.options[selected.selectedIndex].text);
  }
}

function createMarkup(){
  return {__html: 'First &middot; Second'}
}

export default App;