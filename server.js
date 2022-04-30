const express = require("express");
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require("graphql")
const app = express(); 
//BoilerPlate Data For Practice 
//Don't feel like hooking up a database 
const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "This represents an Author of a book",
    fields: () =>( { 
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType), //List of books 
            resolve: (author) => { 
                return books.filter(book => book.authorId === author.id) //list of all the books for author
            }
        }
    })

})


const BookType = new GraphQLObjectType({
    name: "Book",
    description: "This represents a book written by an author",
    fields: () =>( { 
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString) },
        authorId: {type: new GraphQLNonNull(GraphQLInt)},
        author:{
        type: AuthorType,
        resolve: (book) => { 
            return authors.find(author => author.id === book.authorId )
        }}
    })

})



const RootQueryType = new GraphQLObjectType( { 
    name: "Query",
    description: "Root Query", //Know this is top level 
    fields: () => ({
        book: {
            type: BookType, 
            description: "Single B ok",
            args: {
                id: { 
                    type: GraphQLInt
                },
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)//if book[1] === 1 return Harry Potter* 
        },
        books: { 
            type: new GraphQLList(BookType),
            description: "List of All Books",
            resolve: () => books
        },
        authors: { 
            type: new GraphQLList(AuthorType),
            description: "List of Authors",
            resolve: () => authors
        },
        author: { 
            type: AuthorType,
            description: "A Single Author",
            args: { 
                id: { 
                    type: GraphQLInt
                },
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        }
    })
})
const RootMutationType = new GraphQLObjectType({
    name: "Muatation",
    description: "Root Mutations", 
    fields: () => ({ 
        addBook: { 
            type: BookType, 
            description: "Add A Book",
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString),  //Require a name field
                }, 
                authorId: { 
                    type: new GraphQLNonNull(GraphQLInt),
                }
            },
            resolve: (parent, args) =>  {
                const book = {
                    id: books.length + 1, name: args.name, authorId: args.authorId
                }
                books.push(book)
                return book
            },
        },
        addAuthor: { 
            type: AuthorType,
            description: "Add A Author",
            args: { 
                name: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: () => { 
                const author = {id: author.length + 1, name: args.name}
                authors.push(authors)
                return author
            }
            
        }
    })
})
const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType

})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(5000., () => console.log("server is running"));


