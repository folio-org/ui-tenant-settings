import {
  SELECTED_PICKUP_LOCATION_VALUE,
  UNSELECTED_PICKUP_LOCATION_VALUE,
  LAYER_EDIT,
  isLayerEdit,
  isConfirmPickupLocationChangeModalShouldBeVisible,
} from './ServicePointForm';

describe('ServicePointForm', () => {
  const OTHER_LAYER = 'other';

  describe('isLayerEdit', () => {
    it(`should return true for layer equal "${LAYER_EDIT}"`, () => {
      expect(isLayerEdit(LAYER_EDIT)).toBe(true);
    });

    it(`should return false for layer not equal "${LAYER_EDIT}"(${OTHER_LAYER})`, () => {
      expect(isLayerEdit(OTHER_LAYER)).toBe(false);
    });
  });

  describe('isConfirmPickupLocationChangeModalShouldBeVisible', () => {
    it(`should return true for layer equal "${LAYER_EDIT}" and value "${UNSELECTED_PICKUP_LOCATION_VALUE}"`, () => {
      expect(isConfirmPickupLocationChangeModalShouldBeVisible(LAYER_EDIT, UNSELECTED_PICKUP_LOCATION_VALUE)).toBe(true);
    });

    it(`should return false for layer equal "${LAYER_EDIT}" and value "${SELECTED_PICKUP_LOCATION_VALUE}"`, () => {
      expect(isConfirmPickupLocationChangeModalShouldBeVisible(LAYER_EDIT, SELECTED_PICKUP_LOCATION_VALUE)).toBe(false);
    });

    it(`should return false for layer not equal "${LAYER_EDIT}"(${OTHER_LAYER}) and value "${UNSELECTED_PICKUP_LOCATION_VALUE}"`, () => {
      expect(isConfirmPickupLocationChangeModalShouldBeVisible(OTHER_LAYER, UNSELECTED_PICKUP_LOCATION_VALUE)).toBe(false);
    });

    it(`should return false for layer not equal "${LAYER_EDIT}"(${OTHER_LAYER}) and value "${SELECTED_PICKUP_LOCATION_VALUE}"`, () => {
      expect(isConfirmPickupLocationChangeModalShouldBeVisible(OTHER_LAYER, SELECTED_PICKUP_LOCATION_VALUE)).toBe(false);
    });
  });
});
