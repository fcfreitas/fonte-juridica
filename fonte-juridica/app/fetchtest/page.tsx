export default async function FetchTest() {
    const response = await fetch('https://urban-space-bassoon-pj7xqjwjj7j937j7v-3000.app.github.dev/api/hello')
    const data = await response.json();

    return <h1>{data.message}</h1>
}