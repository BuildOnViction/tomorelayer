import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { Grid } from '@material-ui/core'
import { I18N_LANGS } from 'service/constant'
import gb from 'style/flags/4x3/gb.svg'
import vn from 'style/flags/4x3/vn.svg'
import jp from 'style/flags/4x3/jp.svg'

const flags = {
  en: gb,
  vn: vn,
  jp: jp,
}

class LangSelector extends React.Component {
  render() {
    const { Lang, changeLang } = this.props
    return (
      <Grid className="align-center">
        <img
          alt={Lang}
          src={flags[Lang]}
          className="lang-flag pointer"
          onClick={this.openDropdown}
        />
        <select onChange={e => changeLang(e.target.value)} value={Lang} className="lang-select">
          {I18N_LANGS.map(op => (
            <option value={op.value} key={op.value}>
              {op.label}
            </option>
          ))}
        </select>
      </Grid>
    )
  }
}

const mapProps = store => ({
  Lang: store.Lang
})

const actions = () => ({
  changeLang: (state, Lang) => ({ Lang })
})

export default connect(mapProps, actions)(LangSelector)
