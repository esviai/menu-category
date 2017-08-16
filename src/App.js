import React from 'react'
import Axios from 'axios'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      categories: [],
      categoryLevel: 0,
      choosenCategory: [],
    }
  }

  componentDidMount () {
    Axios.get('http://localhost:8080/main.json')
      .then((response) => {
        this.setState({
          categories: [...response.data.categories],
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  handleCategoryClick (category) {
    console.log(category)
    if (category.sub) {
      Axios.get(`http://localhost:8080/${category.sub}`)
        .then ((response) => {
          this.setState({
            categories: [...response.data.categories],
            categoryLevel: this.state.categoryLevel + 1,
          }, () => {
            this.state.choosenCategory.push(category.name)
          })
        })
        .catch ((error) => {
          console.log(error)
        })
    }
  }

  handleCategoryClose () {
    if (this.state.categoryLevel > 0) {
      this.setState({
        categoryLevel: this.state.categoryLevel - 1,
      }, () => {
        if (this.state.categoryLevel > 0) {
          Axios.get(`http://localhost:8080/${this.state.choosenCategory[0]}`)
            .then ((response) => {
              this.setState({
                categories: [...response.data.categories],
                choosenCategory: this.state.choosenCategory.pop(),
              })
            })
            .catch ((error) => {
              console.log(error)
            })
        } else {
          Axios.get('http://localhost:8080/main.json')
            .then((response) => {
              this.setState({
                categories: [...response.data.categories],
              })
            })
            .catch((error) => {
              console.log(error)
            })
        }
      })
    }
  }

  render() {
    return (
      <div className="App container">
        <section className="hero" style={{backgroundColor: '#d51a4e'}}>
          <div className="hero-body">
            <div className="container">
              <h1 className="title has-text-centered" style={{color: 'white'}}>
                BUKALAPAK
              </h1>
            </div>
          </div>
        </section>
        <div className="columns" style={{backgroundColor: 'lightgrey'}}>
          <column className="is-two-third">
            <p style={{color: 'black'}}>Pilih {this.state.categoryLevel === 0 ? 'Kategori' : `Subkategori ${this.state.choosenCategory[this.state.categoryLevel - 1]}`}</p>
          </column>
          <column>
            {this.state.categoryLevel > 0 ? <i onClick={() => this.handleCategoryClose()} className="fa fa-times"></i> : null}
          </column>
        </div>
        <section>
          {this.state.categories.map((category, index) => {
            return(
              <div key={index}>
                <p onClick={() => this.handleCategoryClick(category)} style={this.state.categoryLevel === 0 ? index%2 === 1 ? {backgroundColor: 'lightgrey'} : {backgroundColor: 'white'} : {}}>{category.name}</p>
              </div>
            )
          })
          }

        </section>
      </div>
    )
  }
}



export default App
