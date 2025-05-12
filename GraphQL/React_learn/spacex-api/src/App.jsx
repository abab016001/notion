import { useQuery, gql } from '@apollo/client';

const GET_SPACE_X = gql`
  query {
    launchesPast(limit: 5) {
      mission_name
      launch_date_local
      rocket {
        rocket_name
      }
    }
  }

`;

function App() {
  const { data, loading, error } = useQuery(GET_SPACE_X);

  console.log(data);

  if (loading) return <div>載入中...</div>
  if (error) return <div>錯誤: {error.message}</div>

  return (
    <div>
      <h1>✅ 2. SpaceX API（太空任務）</h1>
      <ul>
          {
            data.launchesPast.map((item, index) => {
              return (
                <li key={index}>
                  <b>Mission Name: {item.mission_name}</b><br />
                  <b>Lauch Date Local: {item.launch_date_local}</b><br />
                  <b>Rocket: {item.rocket.rocket_name}</b><br />
                </li>
              )
            })
          }
      </ul>
    </div>
  );
}

export default App;