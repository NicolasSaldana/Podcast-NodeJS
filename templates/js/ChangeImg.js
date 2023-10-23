const defaultFile = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
const file = document.getElementById("inputFileServer");
const img = document.getElementById("img");

file.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        img.src = URL.createObjectURL(file);
        const formData = new FormData();
        const fileName = file.name.replace(/\\/g, '/'); // Reemplazar todas las barras invertidas "\" por barras normales "/"
        formData.append("imagen", file, fileName);

        fetch("/configuraciones", {
            method: "POST",
            body: formData
        })
            .then(response => response.text())
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.error(error);
            });
    } else {
        img.src = defaultFile;
    }
});