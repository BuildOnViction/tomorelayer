import { Container, Grid, Card } from '@utility'


const list = new Array(1).fill(null)

export const Home = () => (
  <Grid className="home">
    {list.map((_, idx) => (
      <Card className="col-md-12" key={idx}>
        Welcome
      </Card>
    ))}
  </Grid>
)
