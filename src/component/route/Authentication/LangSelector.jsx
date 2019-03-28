import React from 'react'
import { connect } from 'redux-zero/react'
import { Grid } from 'component/utility'
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
    const { lang, changeLang } = this.props
    return (
      <Grid className="align-center">
        <img
          alt={lang}
          src={flags[lang]}
          className="lang-flag pointer"
          onClick={this.openDropdown}
        />
        <select onChange={e => changeLang(e.target.value)} value={lang} className="lang-select">
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
  lang: store.global.lang
})

const actions = () => ({
  changeLang: (state, lang) => ({
    ...state,
    global: {
      ...state.global,
      lang
    }
  })
})

export default connect(mapProps, actions)(LangSelector)
