export async function deleteCercle(id) {
    await fetch(`https://localhost:7241/circle/${id}`, {
        method: 'DELETE',
    });
}
