module.exports = {
  widget: {
    options: {
      paths: ["./src/widgets/styles"]
    },
    files: {
      "./public/main.css": "./src/widgets/styles/main.less"
    }
  },
  site: {
    options: {
      paths: ["./src/site/styles"]
    },
    files: {
      "./public/styles.css": "./src/site/styles/styles.less"
    }

  }
}
