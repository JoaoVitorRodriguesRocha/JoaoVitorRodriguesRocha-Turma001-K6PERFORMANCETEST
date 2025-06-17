import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import http from 'k6/http';
import { check } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// Métricas customizadas
export const getRequestDuration = new Trend('get_request_duration', true);
export const requestSuccessRate = new Rate('request_success_rate');

export const options = {
  thresholds: {
    get_request_duration: ['p(95)<5700'],         
    request_success_rate: ['rate>0.88'],          
    http_req_failed: ['rate<0.12'],               
  },
  stages: [
    
    { duration: '30s', target: 10 },
    { duration: '30s', target: 20 },
    { duration: '30s', target: 15 },
    { duration: '30s', target: 30 },
    { duration: '20s', target: 25 },
    { duration: '20s', target: 50 },
    { duration: '20s', target: 80 },

    
    { duration: '30s', target: 150 },

    
    { duration: '50s', target: 150 },

    
    { duration: '40s', target: 300 },
  ]
  
};

export function handleSummary(data) {
  return {
    './src/output/index.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true })
  };
}

export default function () {
  const url = 'https://jsonplaceholder.typicode.com/posts/1';  // API pública funcional
  const res = http.get(url);

  getRequestDuration.add(res.timings.duration);
  requestSuccessRate.add(res.status === 200);

  check(res, {
    'Status is 200': (r) => r.status === 200,
  });
}
