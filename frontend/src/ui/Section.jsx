import Carousel from './Carousel'
import Card from './Card'
import './Section.css'


function Section({ title, type, items }) {
  return (
    <div className="section">

      <h2 className="sectionTitle">{title}</h2>

      {type === 'info' ? (
        <div className="infoBox">
          {items[0]}
        </div>
      ) : type === 'fields' ? (
        <Carousel>
          {items.map((item) => (
            <Card
              key={item.label}
              type="category"
              label={item.label}
              to={item.to}
            />
          ))}
        </Carousel>
      ) : (
        <Carousel>
          {items.map((item) => (
            <Card key={item} type="content" label={item} />
          ))}
        </Carousel>
      )}

    </div>
  )
}

export default Section