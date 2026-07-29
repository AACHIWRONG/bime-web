import json
import re
import os

with open('style.css.bak', 'r', encoding='utf-8') as f:
    lines = f.readlines()

content_top = ''.join(lines[:599])

css_exact_replacements = {
    '#loader {': '.bime-loader {',
    '.loader__label': '.bime-loader__label',
    '.loader__bar-bg': '.bime-loader__bar-bg',
    
    '#main-header': '.bime-header',
    '.logo {': '.bime-header__logo {',
    '.logo-icon': '.bime-header__logo-icon',
    '.logo-text': '.bime-header__logo-text',
    '.top-nav': '.bime-header__nav',
    '.menu-icon': '.bime-header__menu-btn',
    
    '#vertical-nav': '.bime-sidebar',
    '.nav-track': '.bime-sidebar__track',
    '.nav-item': '.bime-sidebar__item',
    '.bime-sidebar__item.active': '.bime-sidebar__item--active',
    '.nav-indicator': '.bime-sidebar__indicator',
    '.nav-text': '.bime-sidebar__text',
    '.nav-num': '.bime-sidebar__num',
    '.nav-label': '.bime-sidebar__label',
    
    '#page': '.bime-main',
    
    '.scroll-container': '.bime-dna__scroll-container',
    '.canvas-wrapper': '.bime-dna__canvas-wrapper',
    '#bg-canvas': '.bime-dna__bg',
    '#animation-canvas': '.bime-dna__animation',
    '#landing-static-bg': '.bime-dna__landing-bg',
    '.scroll-spacer': '.bime-dna__spacer',
    
    '.ppt-overlay.visible': '.bime-overlay.bime-overlay--visible',
    '.ppt-overlay': '.bime-overlay',
    '#overlay-landing': '.bime-overlay--landing',
    '.landing-left': '.bime-overlay__content',
    '.landing-title': '.bime-overlay__title',
    '.highlight': '.bime-overlay__highlight',
    '.overlay-divider': '.bime-overlay__divider',
    '.landing-desc': '.bime-overlay__desc',
    '.landing-actions': '.bime-overlay__actions',
    '.watch-btn .icon': '.bime-overlay__btn-watch .bime-overlay__btn-icon',
    '.watch-btn': '.bime-overlay__btn-watch',
    '.scroll-hint': '.bime-overlay__scroll-hint',
    '.landing-right': '.bime-overlay__slogan',
    
    '.overlay-left': '.bime-overlay__content-left',
    '.overlay-center-right': '.bime-overlay__content-center-right',
    '.overlay-bottom-right': '.bime-overlay__content-bottom-right',
    '.overlay-num': '.bime-overlay__num',
    '.overlay-title-zh': '.bime-overlay__title-zh',
    '.overlay-title-en': '.bime-overlay__title-en',
    '.overlay-desc': '.bime-overlay__desc',
    '.explore-btn .icon': '.bime-overlay__btn-explore .bime-overlay__btn-icon',
    '.explore-btn': '.bime-overlay__btn-explore',
    '.sub-field': '.bime-overlay__sub-field',
    '.icon-circle': '.bime-overlay__icon-circle',
    
    '#six-fields': '.bime-fields',
    '.hub-spoke-section': '.bime-fields__layout',
    '.hub-intro': '.bime-fields__intro',
    '.hub-number': '.bime-fields__num',
    '.hub-title': '.bime-fields__title',
    '.hub-subtitle': '.bime-fields__subtitle',
    '.hub-desc': '.bime-fields__desc',
    '.hub-wheel-container': '.bime-fields__wheel',
    '.wheel-ring.outer': '.bime-fields__ring--outer',
    '.wheel-ring.main': '.bime-fields__ring--main',
    '.wheel-ring.inner': '.bime-fields__ring--inner',
    '.wheel-ring.core': '.bime-fields__ring--core',
    '.wheel-ring': '.bime-fields__ring',
    '.wheel-center': '.bime-fields__center',
    '.field-node': '.bime-fields__node',
    '.node-tl': '.bime-fields__node--tl',
    '.node-tc': '.bime-fields__node--tc',
    '.node-tr': '.bime-fields__node--tr',
    '.node-bl': '.bime-fields__node--bl',
    '.node-bc': '.bime-fields__node--bc',
    '.node-br': '.bime-fields__node--br',
    '.field-icon': '.bime-fields__node-icon',
    '.node-label': '.bime-fields__node-label',
    '.label-top': '.bime-fields__node-label--top',
    '.label-bottom': '.bime-fields__node-label--bottom',
    '.label-left': '.bime-fields__node-label--left',
    '.label-right': '.bime-fields__node-label--right',
    
    '#azalea-works': '.bime-works',
    '.sticky-container': '.bime-works__sticky',
    '.horizontal-scroll-content': '.bime-works__horizontal',
    '.intro-card': '.bime-card--intro',
    '.layout-one-third': '.bime-card--one-third',
    '.card-image': '.bime-card__image',
    '.card-content': '.bime-card__content',
    '.tag': '.bime-card__tag',
    '.card {': '.bime-card {',
    '.card:hover': '.bime-card:hover',
    
    '.floating-widget': '.bime-widget',
    '.widget-title': '.bime-widget__title',
    '.widget-stats': '.bime-widget__stats',
    '.stat-item': '.bime-widget__stat-item',
    '.stat-label': '.bime-widget__label',
}

for old, new in css_exact_replacements.items():
    content_top = content_top.replace(old, new)

with open('recovered_bottom.css', 'r', encoding='utf-8') as f:
    content_bottom = f.read()

# Fix the trailing issue: the diff start was slightly overlapping or something
content_full = content_top + '\n' + content_bottom

with open('style_recovered.css', 'w', encoding='utf-8') as f:
    f.write(content_full)
print('Recovered to style_recovered.css!')
