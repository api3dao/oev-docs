import DefaultTheme from 'vitepress/theme';
import { onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';
import mediumZoom from 'medium-zoom';
import PageHeader from '../../_components/PageHeader.vue';
import CopyIcon from '../../_components/CopyIcon.vue';
import Video from '../../_components/Video.vue';

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
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src =
        'https://dashboard.letmeexplain.ai/embed/lme_chatbot_widget.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        window.loadCustomWidget({
          orgId: '5f12b6b7-97b7-4e',
        });
      };
    }
    app.component('PageHeader', PageHeader);
    app.component('CopyIcon', CopyIcon);
    app.component('Video', Video);
  },
};
