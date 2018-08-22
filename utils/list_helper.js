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

const mostBlogs = (blogs) => {
  if (blogs.length === 0)
    return null

  const authors = blogs.reduce((authors, blog) => {
    const indexOfAuthor = authors.findIndex((author) => {
      return author.author === blog.author
    })
    if (indexOfAuthor === -1) { //Ei löytynyt
      authors.push({
        author: blog.author,
        blogs: 1
      })
    }
    else {
      authors[indexOfAuthor].blogs += 1
    }
    return authors
  },[])

return authors.reduce((authorWithMostBlogs, author) => {
    return author.blogs > authorWithMostBlogs.blogs ? author :authorWithMostBlogs
  })  // Ei alkuarvoa annettu, käyttää taulukon ensimmäistä alkuarvona

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
