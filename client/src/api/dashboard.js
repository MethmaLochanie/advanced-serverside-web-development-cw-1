// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;

// export async function getDashboardStats(token) {
//   // 1) Fetch the list of API keys
//   const { data: keys } = await axios.get(
//     `${API_URL}/keys`,
//     { headers: { Authorization: `Bearer ${token}` } }
//   );

//   // 2) Compute activeKeys and totalRequests from any usage_count field
//   const activeKeys = keys.filter(k => k.is_active).length;
//   let totalRequests = keys.reduce(
//     (sum, key) => sum + (key.usage_count || 0),
//     0
//   );

//   // 3) Fetch usage for each key in parallel
//   const usageResponses = await Promise.all(
//     keys.map(key =>
//       axios.get(
//         `${API_URL}/keys/${key.id}/usage`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//     )
//   );

//   // 4) Flatten all usage entries and tally endpoint counts
//   const allUsage = usageResponses.flatMap(res => res.data);
//   const endpointCounts = allUsage.reduce((acc, u) => {
//     acc[u.endpoint] = (acc[u.endpoint] || 0) + u.count;
//     return acc;
//   }, {});

//   // 5) Pick top 5 endpoints
//   const popularEndpoints = Object.entries(endpointCounts)
//     .sort(([, a], [, b]) => b - a)
//     .slice(0, 5)
//     .map(([endpoint, count]) => ({ endpoint, count }));

//   // Return the assembled stats object
//   return { activeKeys, totalRequests, popularEndpoints };
// }
