

export async function GET() {

    return new Response(JSON.stringify({message: "Hello from Fonte-Juridica"}),{
        status: 200,
        headers: {
           'Content-type': 'application/json'
        }
    })

}