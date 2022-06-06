/* eslint-disable */
import '@testing-library/jest-dom/';
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { cleanup, findByRole, findByTestId, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mocks from './__mocks__/mocks';
import ProductListingPage from '../pages/PLP/ProductListingPage';

describe('Product Listing Page', () => {
  
  describe('Header Component', () => {
    afterEach(() => cleanup());

    it('Check if all categories are correctly showed in the header', async () => {
      const history = createMemoryHistory();
      const { container } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Router location={history.location} navigator={history}>
            <ProductListingPage />
          </Router>
        </MockedProvider>,
      );

      const allCategoryTitle = await findByRole(container, 'button', { name: /all/i });
      const clothesCategoryTitle = await findByRole(container, 'button', { name: /clothes/i });
      const techCategoryTitle = await findByRole(container, 'button', { name: /tech/i });

      expect(allCategoryTitle).toBeInTheDocument();
      expect(clothesCategoryTitle).toBeInTheDocument();
      expect(techCategoryTitle).toBeInTheDocument();
    });

    it('Check if shopping bag icon and cart icon are correctly showed in the header', async () => {  
      const history = createMemoryHistory();
      const { container } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Router location={history.location} navigator={history}>
            <ProductListingPage />
          </Router>
        </MockedProvider>,
      );

      const shoppingBagIcon = await findByRole(container, 'img', { name: /shopping bag/i });
      const cartIcon = await findByTestId(container, 'cart-icon');
  
      expect(shoppingBagIcon).toBeInTheDocument();
      expect(cartIcon).toBeInTheDocument();
    });

    it('Check if currency dropdown is correctly showed and that it changes when selecting another currency', async () => {  
      const history = createMemoryHistory();
      const { container } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Router location={history.location} navigator={history}>
            <ProductListingPage />
          </Router>
        </MockedProvider>,
      );

      const currencyDropdownArrow = await findByTestId(container, 'dropdown-arrow');
      expect(currencyDropdownArrow).toBeInTheDocument();

      userEvent.click(currencyDropdownArrow);

      const gbpCurrency = await findByRole(container, 'button', { name: /£ gbp/i });
      expect(gbpCurrency).toBeInTheDocument();

      userEvent.click(gbpCurrency);

      const currentCurrency = await findByTestId(container, 'current-currency');
      expect(currentCurrency).toHaveTextContent('£');
    });
  });


  describe('Product Listing', () => {
    afterEach(() => cleanup());

    it('Check if the page is showing products from every category', async () => {  
      const history = createMemoryHistory();
      const { container } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Router location={history.location} navigator={history}>
            <ProductListingPage />
          </Router>
        </MockedProvider>,
      );

      const jacket = await findByRole(container, 'heading', { name: /canada goose jacket/i });
      const imac = await findByRole(container, 'heading', { name: /apple imac 2021/i });
      
      expect(jacket).toBeInTheDocument();
      expect(imac).toBeInTheDocument();
    });

    it('Check that when selecting Clothes category, only products from this category are showed', async () => {  
      const history = createMemoryHistory();
      const { container } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Router location={history.location} navigator={history}>
            <ProductListingPage />
          </Router>
        </MockedProvider>,
      );
      const allCategoryTitle = await findByRole(container, 'button', { name: /all/i });
      expect(allCategoryTitle).toBeInTheDocument();
      userEvent.click(allCategoryTitle);

      const jacket = await findByRole(container, 'heading', { name: /canada goose jacket/i });
      const imac = await findByRole(container, 'heading', { name: /apple imac 2021/i });
      
      expect(jacket).toBeInTheDocument();
      expect(imac).toBeInTheDocument();

      const clothesCategoryTitle = await findByRole(container, 'button', { name: /clothes/i });
      expect(clothesCategoryTitle).toBeInTheDocument();

      userEvent.click(clothesCategoryTitle);

      expect(jacket).toBeInTheDocument();
      expect(imac).not.toBeInTheDocument();
    });

    it('Check that when selecting Tech category, only products from this category are showed', async () => {  
      const history = createMemoryHistory();
      const { container } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Router location={history.location} navigator={history}>
            <ProductListingPage />
          </Router>
        </MockedProvider>,
      );
      const allCategoryTitle = await findByRole(container, 'button', { name: /all/i });
      expect(allCategoryTitle).toBeInTheDocument();
      userEvent.click(allCategoryTitle);
      
      const jacket = await findByRole(container, 'heading', { name: /canada goose jacket/i });
      const imac = await findByRole(container, 'heading', { name: /apple imac 2021/i });
      
      expect(jacket).toBeInTheDocument();
      expect(imac).toBeInTheDocument();

      const techCategoryTitle = await findByRole(container, 'button', { name: /tech/i });
      expect(techCategoryTitle).toBeInTheDocument();

      userEvent.click(techCategoryTitle);

      expect(jacket).not.toBeInTheDocument();
      expect(imac).toBeInTheDocument();
    });
  });
});
