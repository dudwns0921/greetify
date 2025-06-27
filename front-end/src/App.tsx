import usePost from "./hooks/usePost"

function App() {
  const { post } = usePost("/greet");

  const handleClickGreet = async () => {
    const response = await post(null);
    console.log(response?.message);
  }

  return (
    <>
      <div>
        <button onClick={handleClickGreet}>
          Greet
        </button>
      </div>
    </>
  )
}

export default App
