const btn = document.querySelector(".post-book > form > button")
const getBooks = document.getElementsByClassName("get-books")[0]


window.addEventListener("load", e => {
    fetch("/all")
        .then(res => res.json())
        .then(data => render(data))
        .catch(err => console.log(err))
})

let render = data => {

    data.forEach(i => {
        const div = document.createElement("div")
        const h1 = document.createElement("h1")
        const h2 = document.createElement("h2")
        const h3 = document.createElement("h3")

        h1.textContent = i.title
        h2.textContent = i.author
        h3.textContent = i.copies

        div.append(h1, h2, h3)

        getBooks.appendChild(div)
    })
}

btn.addEventListener("click", e => {
    e.preventDefault()
    fetch("/create", {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify({
            title: e.target.form[0].value,
            author: e.target.form[1].value,
            copies: e.target.form[2].value
        })
    })
    .then(() => location.reload())
})