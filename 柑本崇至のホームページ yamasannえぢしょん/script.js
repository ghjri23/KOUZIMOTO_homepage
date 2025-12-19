// -------------------------
// 定数・要素取得
// -------------------------
const button = document.getElementById("input_button");
const commentList = document.getElementById("comment_list");
const textInput = document.getElementById("input_comment");
const nameInput = document.getElementById("name");
const moreButton = document.getElementById("more_button");
const not_comment = document.getElementById("not_comment");
const moreArea = document.querySelector(".more-area");

// 「コメントを戻す」ボタンを作成
const resetButton = document.createElement("button");
resetButton.id = "reset_button";
resetButton.textContent = "コメントを戻す";
resetButton.style.display = "none";
moreArea.appendChild(resetButton);

// -------------------------
// URLをリンク化する関数
// -------------------------
function linkify(text) {
    const lines = text.split('\n');

    const linkedLines = lines.map(line => {
        // URLのパターン：http/https で始まり、英数字と記号のみ
        const urlPattern = /(https?:\/\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]+)/g;

        return line.replace(urlPattern, function(url) {
            return `<a href="${url}" target="_blank" class="external-link">${url}</a>`;
        });
    });

    return linkedLines.join('<br>');
}


// -------------------------
// 日時取得関数
// -------------------------
function twoDigit(num) {
    return num.toString().padStart(2, "0");
}

function day_get() {
    const now = new Date();
    const year = now.getFullYear();
    const month = twoDigit(now.getMonth() + 1);
    const day = twoDigit(now.getDate());
    const hour = twoDigit(now.getHours());
    const minute = twoDigit(now.getMinutes());
    const second = twoDigit(now.getSeconds());
    return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
}

// -------------------------
// コメント追加処理
// -------------------------
button.addEventListener("click", function () {
    if (textInput.value.trim() === "" || nameInput.value.trim() === "") return;
    if (not_comment) not_comment.style.display = "none";

    const new_times = day_get();

    const commentDiv = document.createElement("div");
    commentDiv.className = "comment";

    const names = document.createElement("h4");
    names.className = "comment-header";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = `${nameInput.value} さん`;

    const timeSpan = document.createElement("span");
    timeSpan.textContent = new_times;

    names.appendChild(nameSpan);
    names.appendChild(timeSpan);

    const p = document.createElement("p");
    p.innerHTML = linkify(textInput.value); // 改行＆URLリンク化

    commentDiv.appendChild(names);
    commentDiv.appendChild(p);
    commentList.prepend(commentDiv);

    textInput.value = "";
    nameInput.value = "";

    updateCommentsDisplay();
});

// -------------------------
// コメント表示更新関数
// -------------------------
function updateCommentsDisplay() {
    const comments = document.querySelectorAll("#comment_list .comment");

    // 3件以降非表示
    comments.forEach((comment, index) => {
        if (index >= 3) comment.classList.add("hidden");
        else comment.classList.remove("hidden");
    });

    // ボタン表示制御
    if (comments.length > 3) {
        moreButton.style.display = "block";
    } else {
        moreButton.style.display = "none";
    }

    // 件数表示
    const commentCountSpan = document.getElementById("comment_count");
    if (commentCountSpan) {
        commentCountSpan.textContent = `(${comments.length}件)`;
    }
}

// -------------------------
// 「さらに表示」ボタン
// -------------------------
moreButton.addEventListener("click", function () {
    const comments = document.querySelectorAll("#comment_list .comment");
    comments.forEach(comment => comment.classList.remove("hidden"));
    moreButton.style.display = "none";
    resetButton.style.display = "block";
});

// -------------------------
// 「コメントを戻す」ボタン
// -------------------------
resetButton.addEventListener("click", function () {
    const comments = document.querySelectorAll("#comment_list .comment");
    comments.forEach((comment, index) => {
        if (index >= 3) comment.classList.add("hidden");
        else comment.classList.remove("hidden");
    });
    resetButton.style.display = "none";
    moreButton.style.display = "block";
});

// -------------------------
// 外部リンク警告
// -------------------------
commentList.addEventListener("click", function(e) {
    if (e.target && e.target.classList.contains("external-link")) {
        e.preventDefault();
        const proceed = confirm("外部ページにアクセスします。よろしいですか？");
        if (proceed) {
            window.open(e.target.href, "_blank");
        }
    }
});
