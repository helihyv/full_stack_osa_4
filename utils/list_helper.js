const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((count, blog) => {
    return count + blog.likes
  },0)

}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((favoriteBlog, blog) => {
    return blog.likes > favoriteBlog.likes ? blog : favoriteBlog
  })// Ei alkuarvoa annettu, käyttää taulukon ensimmäistä alkuarvona

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
