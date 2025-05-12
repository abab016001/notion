import { gql, useQuery } from '@apollo/client';

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
      emoji
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_COUNTRIES);

  if (loading) return <p>載入中...</p>;
  if (error) return <p>錯誤：{error.message}</p>;

  return (
    <div>
      <h1>🌍 國家列表</h1>
      <ul>
        {
          data.countries.map((country) => {
            return (
              <li key={country.code}>
                {country.emoji} {country.name}
              </li>
            );
          })
        }
      </ul>
    </div>
  );
}

export default App;