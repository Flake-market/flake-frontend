interface PageProps {
    params: {
      address: string
    }
  }
  
  export default function RequestPage({ params }: PageProps) {
    return (
      <main className="container">
        <h1>Request Sponsored Post</h1>
        <p>Market Address: {params.address}</p>
      </main>
    )
  }