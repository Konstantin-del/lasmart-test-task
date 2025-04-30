export async function deleteCercle(id : string) {
    await fetch(`https://localhost:7241/circle/${id}`, {
        method: 'DELETE',
    })
}