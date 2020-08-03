function processAlgorithms(response) { 
    document.getElementById('algo_section').innerHTML = "";
    document.getElementById('algo_section').appendChild(createAlgorithmsList(response.body));
}

export function getAlgorithms(e) {
  fetch('https://vrpapp.azurewebsites.net/api/GetAlgorithms?code=UjApmnNal9QLCTQ9nipRgUhEKcTPekubrL0RPs9aXFBRHWdvIjsNVQ==', {
    method: 'POST',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-type': 'application/json'
    }
  })
  .then(res =>  res.json().then(data => ({status: res.status, body: data}))).then(obj => processAlgorithms(obj));
}

function createAlgorithmsList(arr){
    const select_algorithm = document.createElement('select');
    select_algorithm.setAttribute("id", "algo_list");
    select_algorithm.setAttribute("class", "select_algo");
    select_algorithm.setAttribute("name", "Select Algorithm");
    select_algorithm.addEventListener("change", () => reset());

    var initial_option = document.createElement("option");
    initial_option.setAttribute("value", "none");
    initial_option.setAttribute("selected", "selected");
    initial_option.setAttribute("disabled", "disabled");
    initial_option.setAttribute("hidden", "hidden");
    var init_op_name = document.createTextNode("Select Algorithm");
    initial_option.append(init_op_name);
    select_algorithm.appendChild(initial_option);

    for (let i = 0; i < arr.length; i++) {
      const option = document.createElement("option");
      option.setAttribute("value", i.toString());
      var option_name = document.createTextNode(arr[i]);
      option.append(option_name);
      select_algorithm.append(option);
    }

    return select_algorithm;
}

function reset(){
  document.getElementById('graph').style.backgroundColor = "#EEC4CB";
  document.getElementById('graph').innerHTML = `<div style="text-align:center;padding-top:22.5%; font-size:large"> Graph of the routes will be displayed here. </div>`;
  document.getElementById('route').innerHTML = `<div style="text-align:center;padding-top:17.5%; font-size:large"> Solution route will be displayed here. </div>`;
}