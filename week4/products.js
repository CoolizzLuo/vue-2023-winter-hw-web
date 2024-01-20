import { createApp, ref, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

const app = createApp({
  setup() {
    const products = ref([]);
    const isCreate = ref(false);
    const tempProduct = ref({ imagesUrl: [] });

    const handleGetProducts = async () => {
      const res = await apiService.getProducts();
      products.value = res.data.products;
    };

    const openModal = (action, item) => {
      if (action === 'create') {
        tempProduct.value = {
          imagesUrl: [],
        };
        isCreate.value = true;
        productModal.show();
      } else if (action === 'edit') {
        tempProduct.value = { ...item };
        isCreate.value = false;
        productModal.show();
      } else if (action === 'delete') {
        tempProduct.value = { ...item };
        delProductModal.show();
      }
    };

    onMounted(() => {
      apiService.checkAdmin().then(() => handleGetProducts());
    });

    return {
      products,
      tempProduct,
      isCreate,
      handleGetProducts,
      openModal,
    };
  },
});

app.component('productModal', {
  template: '#productModal',
  props: {
    product: {
      type: Object,
    },
    isCreate: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const hideModal = () => {
      productModal.hide();
    };
    const createProduct = async () => {
      await apiService.createProduct(props.product);
      hideModal();

      emit('update');
    };
    const updateProduct = async () => {
      await apiService.updateProduct(props.product);
      hideModal();

      emit('update');
    };

    const handleSubmit = () => (props.isCreate ? createProduct() : updateProduct());

    const createImages = () => {
      props.product.imagesUrl = [];
      props.product.imagesUrl.push('');
    };

    onMounted(() => {
      productModal = new bootstrap.Modal(document.getElementById('productModal'), {
        keyboard: false,
        backdrop: 'static',
      });
    });

    return {
      createImages,
      handleSubmit,
    };
  },
});

app.component('delProductModal', {
  template: '#delProductModal',
  props: ['product'],
  setup(props, { emit }) {
    const handleSubmit = async () => {
      await apiService.deleteProduct(props.product.id);
      hideModal();

      emit('update');
    };

    const openModal = () => {
      delProductModal.show();
    };

    const hideModal = () => {
      delProductModal.hide();
    };

    onMounted(() => {
      delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
        keyboard: false,
        backdrop: 'static',
      });
    });

    return {
      handleSubmit,
    };
  },
});

app.mount('#app');
