const fetchCatButton = document.getElementById('fetch-cat-button');
const catImage = document.getElementById('cat-image');

fetchCatButton.addEventListener('click', async () => {
    console.log(electronAPI);
    const catImageData = await window.electronAPI.fetchCat();
    if (catImageData) {
        catImage.src = catImageData;
    } else {
        alert('Failed to load cat image. Please try again.');
    }
});