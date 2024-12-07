interface PageProps {
  params: {
    address: string
  }
}

export default function PairPage({ params }: PageProps) {
  return (
    <main className="container">
      <h1>Market Details</h1>
      <p>Address: {params.address}</p>
    </main>
  )
}
