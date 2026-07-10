async function loadTimeline() {

    const response = await fetch("/api/timeline_post");

    const data = await response.json();

    const posts = document.getElementById("timeline-posts");

    posts.innerHTML = "";

    data.timeline_posts.forEach(post => {

        posts.innerHTML += `
            <div>
                <h3>${post.name}</h3>

                <small>${post.email}</small>

                <p>${post.content}</p>

                <hr>
            </div>
        `;
    });

}

loadTimeline();

const form = document.getElementById("timeline-form");

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const formData = new FormData();

    formData.append(
        "name",
        document.getElementById("name").value
    );

    formData.append(
        "email",
        document.getElementById("email").value
    );

    formData.append(
        "content",
        document.getElementById("content").value
    );

    await fetch("/api/timeline_post", {
        method: "POST",
        body: formData
    });

    form.reset();

    loadTimeline();

});