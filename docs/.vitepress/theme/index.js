import DefaultTheme from 'vitepress/theme';
import { onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';
import mediumZoom from 'medium-zoom';
import VersionWarning from '../../_components/VersionWarning.vue';
import PageHeader from '../../_components/PageHeader.vue';
import CopyIcon from '../../_components/CopyIcon.vue';
import SponsorWalletWarning from '../../_components/reference/airnode/SponsorWalletWarning.vue';
import DockerHubImages from '../../_components/reference/airnode/DockerHubImages.vue';
import Video from '../../_components/Video.vue';
import EthersAbiCoder from '../../_components/EthersAbiCoder.vue';

import './zoom.css';

export default {
  ...DefaultTheme,
  setup() {
    const route = useRoute();
    const initZoom = () => {
      mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' });
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },

  enhanceApp({ app }) {
    app.component('VersionWarning', VersionWarning);
    app.component('PageHeader', PageHeader);
    app.component('CopyIcon', CopyIcon);
    app.component('SponsorWalletWarning', SponsorWalletWarning);
    app.component('DockerHubImages', DockerHubImages);
    app.component('Video', Video);
    app.component('EthersAbiCoder', EthersAbiCoder);
  },
  globalSearch: { index: { tag: 'myTags' } },
};
