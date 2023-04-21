import ajax from 'utils/ajax'

export function getCarouselList() {
  return ajax.get('/home/carousels')
}
