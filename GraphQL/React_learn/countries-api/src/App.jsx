import { gql, useQuery } from '@apollo/client';

const GET_COUNTRIES = gql`
  query {
    countries {
      code
      emoji
      name
    }
  }
`;

function App() {
  const { loading, data, error } = useQuery(GET_COUNTRIES);

  console.log(data);
  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error.message}</div>

  return (
    <div>
      <h1>✅ 1. Countries API（國家資料）</h1>
      <ul>
        {
          data.countries.map(country => {
            return <li key={country.code}>
              {country.emoji} {country.name}
            </li>
          })
        }
      </ul>
    </div>
  );
}

export default App;