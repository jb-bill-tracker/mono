<script lang="ts">
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';
  import Navbar from '$lib/components/navbar.svelte';
  import '../app.css';

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<Navbar />

<slot />