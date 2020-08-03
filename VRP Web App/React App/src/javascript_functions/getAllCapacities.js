import { setCapacities } from "./runAlgorithm";

function processAllCapacities(response) {
    if (response.status === 200) {
      setCapacities(response.body);
    }
}

export function getAllCapacities(e) {
  fetch('https://vrpapp.azurewebsites.net/api/GetAllCapacities?code=LNlnFbfaLQQk0ygSqAQmutJXWWYep/P3epSlk1v3l8iqb7DTIuMhDw==', {
    method: 'POST',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-type': 'application/json'
    }
  }).then(res =>  res.json().then(data => ({status: res.status, body: data}))).then(obj => processAllCapacities(obj));
}