import { Card, Grid } from '@utility'
import './registration.scss'

export const Registration = () => (
  <Grid className="home justify-center reg-form">
    <Card className="col-md-10 p-0">
      <Grid className="h_100 m-0 reg-form__grid">
        <div className="col-xs-12 col-md-5 reg-login">
          Login
        </div>
        <div className="col-auto reg-wizard">
          Wizard
        </div>
      </Grid>
    </Card>
  </Grid>
)
