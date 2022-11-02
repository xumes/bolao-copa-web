interface HomeProps {
  count: number
}

export default function Home(props: HomeProps) {
  return (
    <>
      <h1 className="text-cyan-500 text-4xl">Pools</h1>
      <p>Count: {props.count.toFixed(0)}</p>
    </>
  )
}

export const getServerSideProps = async () => {
  const response = await fetch(' http://localhost:3333/pools/count')
  const data = await response.json()
  console.log(data)

  return {
    props: {
      count: data.count
    }
  }
}