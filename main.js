const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the in-memory SQlite database.");
});

db.serialize(function () {
  // FTS 테이블 생성
  db.run("CREATE VIRTUAL TABLE articles USING fts5(content, title);");

  // 샘플 기사 추가
  let articles = [
    {
      title: "데이터 과학이 우리 생활에 미치는 영향",
      content:
        "데이터 과학은 현대 사회에서 매우 중요한 역할을 하고 있습니다. 이를 통해 우리는 많은 양의 데이터를 분석하고, 이를 이해하며, 결정을 내리는 데 도움이 됩니다. 이 기사에서는 데이터 과학이 우리 생활에 어떻게 영향을 미치는지에 대해 논의하고자 합니다.",
    },
    {
      title: "AI의 미래: 기계가 인간을 대체할 수 있을까?",
      content:
        "인공지능(AI)의 발전으로 인해, 기계가 인간의 일을 대체하고 있는 상황입니다. 물론, 아직 많은 일들이 기계에게는 불가능하고, 그 일들은 인간의 독특한 능력을 필요로 합니다. 그러나, 과연 기계가 인간을 완전히 대체할 수 있을까요? 이 기사에서는 이에 대한 여러 견해를 조사하였습니다.",
    },
    {
      title: "코딩 교육의 중요성: 모든 아이가 코딩을 배워야 하는 이유",
      content:
        "현대 사회에서는 디지털 기술이 중요하게 여겨지고 있습니다. 이에 따라 코딩 교육의 중요성도 갈수록 부각되고 있습니다. 코딩은 문제 해결 능력과 논리적 사고를 키우는 데 도움이 되며, 아이들이 미래 사회의 일원으로서 준비하는 데 필요한 핵심 기술입니다. 이 기사에서는 코딩 교육이 왜 중요한지에 대해 알아보겠습니다.",
    },
  ];

  let stmt = db.prepare("INSERT INTO articles (title, content) VALUES (?, ?)");
  for (let i = 0; i < articles.length; i++) {
    stmt.run(articles[i].title, articles[i].content);
  }
  stmt.finalize();

  // 검색 쿼리
  let searchQuery = "에게는*";

  db.each(
    "SELECT rowid, title, content FROM articles WHERE articles MATCH ?",
    [searchQuery],
    (err, row) => {
      if (err) {
        throw err;
      }
      console.log(
        `Row ID: ${row.rowid}, Title: ${row.title}, Content: ${row.content}`
      );
    }
  );
});

db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Closed the database connection.");
});
