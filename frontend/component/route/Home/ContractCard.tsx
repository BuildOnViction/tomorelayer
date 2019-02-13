import { Button, Card, Elevation } from '@blueprintjs/core'

const ContractCard = ({ contract, name }) => (
  <Card interactive elevation={Elevation.ONE}>
    <h2 className="text-blue"><a href="#">{name}</a></h2>
    <h4>
      <span>
        <a href="#" className="text-dark">
          {contract.address}
        </a>
      </span>
      <span>
        <Button className="float-right">
          Action
        </Button>
      </span>
    </h4>
    <div className="mb-2 mt-3">
      <p className="code__json">
        {JSON.stringify(contract.abi)}
      </p>
    </div>
  </Card>
)

export default ContractCard
