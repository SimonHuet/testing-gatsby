const path = require(`path`)
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`src/templates/blogTemplate.js`)
  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: ASC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges

    return posts.forEach(({ node } , index ) => {
        const path = node.frontmatter.path
        createPage({
        path: node.frontmatter.path,
        component: blogPostTemplate,
        context: {
            pathSlug: path,
            prev: index === 0 ? null : posts[index - 1].node,
            next: index === (posts.length -1) ? null : posts[index + 1].node
          
        }
      })
    })
  })
}