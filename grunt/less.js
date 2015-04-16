module.exports = {
  widget: {
    options: {
      paths: ["./src/styles"]
    },
    files: {
      "./public/main.css": "./src/styles/main.less"
    }
  },
  site: {
    options: {
      paths: ["./src/styles"]
    },
    files: {
      "./public/styles.css": "./src/styles/styles.less"
    }

  }
}
