import {
  render,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getNextVolumePrice,
  getVolumeUnitPrice,
} from "@/shared/domain/volumePricing/VolumePricing";

import {
  ProductPriceBlock,
} from "./ProductPriceBlock";

describe(
  "ProductPriceBlock",
  () => {
    it(
      "muestra sin alterar el precio y siguiente tier canónicos",
      () => {
        const product = {
          price_1: 10,
          price_3: 9,
          price_12: 8,
          price_50: 7,
          price_100: 6,
          price_offer: null,
        };

        const effectiveQty = 1;
        const unitPrice =
          getVolumeUnitPrice(
            product,
            effectiveQty,
          );
        const nextVolumePrice =
          getNextVolumePrice(
            product,
            effectiveQty,
          );

        const { container } =
          render(
            <ProductPriceBlock
              unitPrice={unitPrice}
              total={
                unitPrice *
                effectiveQty
              }
              effectiveQty={
                effectiveQty
              }
              pricePulse={false}
              showUnlock={false}
              savingsByQty={0}
              basePrice={
                product.price_1
              }
              nextVolumePrice={
                nextVolumePrice
              }
              isQtyInputValid
            />,
          );

        expect(
          container,
        ).toHaveTextContent(
          "10.00",
        );
        expect(
          container,
        ).toHaveTextContent(
          "Agrega 2 más",
        );
        expect(
          container,
        ).toHaveTextContent(
          "9.00",
        );
      },
    );
  },
);
