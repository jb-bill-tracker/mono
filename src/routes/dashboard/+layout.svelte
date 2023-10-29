<script lang="ts">
  import { AppRail, AppRailAnchor, AppRailTile } from "@skeletonlabs/skeleton";
  import { CreditCardIcon, LayoutDashboardIcon, MenuIcon, ReceiptIcon } from "lucide-svelte";
  import { page } from '$app/stores';
  let currentSidebar = -1;
</script>
<div class="flex gap-3">
  <aside>
    <AppRail>
      	<svelte:fragment slot="lead">
      		<AppRailAnchor href="/" ><MenuIcon class="mx-auto" size={32} /></AppRailAnchor>
      	</svelte:fragment>
      	<!-- --- -->
      	<AppRailTile bind:group={currentSidebar} name="tile-1" value={0} title="tile-1">
      		<svelte:fragment slot="lead"><LayoutDashboardIcon class="mx-auto" size={32} /></svelte:fragment>
      		<span>Dashboard</span>
      	</AppRailTile>
      	<AppRailAnchor href="/dashboard/bills" selected={$page.url.pathname === '/dashboard/bills' } bind:group={currentSidebar} name="tile-2" value={1} title="tile-2">
      		<svelte:fragment slot="lead">
            <ReceiptIcon class="mx-auto" size={32}/>
          </svelte:fragment>
      		<span>Bills</span>
      	</AppRailAnchor>
      	<AppRailTile bind:group={currentSidebar} name="tile-3" value={2} title="tile-3">
      		<svelte:fragment slot="lead">
            <CreditCardIcon size={32} class="mx-auto" />
          </svelte:fragment>
      		<span>Payments</span>
      	</AppRailTile>
      </AppRail>
  </aside> 
  <section class="flex-grow">
    <div class="container mx-auto">
      <slot />
    </div>
  </section>
</div>
