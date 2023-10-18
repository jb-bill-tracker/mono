<script lang="ts">
  import Header from "$lib/components/header/header.svelte";
  import { AppRail, AppRailAnchor, AppRailTile } from "@skeletonlabs/skeleton";
  import { MenuIcon, LayoutDashboardIcon, ReceiptIcon, CreditCardIcon } from 'lucide-svelte';
  export let data;

  const today = new Date();

  const relativeParser = new Intl.RelativeTimeFormat(undefined, { 
    style: 'long',
    numeric: 'auto',
  });

  let upcoming = data.bills.filter(f => Math.abs(f.bills.dueDate - today.getDate()) < 5);
  /**
   * UPCOMING < 5
   * COMING SOON < 10
   * PAID - status===paid
   * PAST - status !== paid && dueDate < currentDate
  */

  let currentSidebar = 0;

</script>

  <div class="flex gap-3">
    <aside>
      <AppRail>
      	<svelte:fragment slot="lead">
      		<AppRailAnchor href="/" ><MenuIcon class="mx-auto" size={36} /></AppRailAnchor>
      	</svelte:fragment>
      	<!-- --- -->
      	<AppRailTile bind:group={currentSidebar} name="tile-1" value={0} title="tile-1">
      		<svelte:fragment slot="lead"><LayoutDashboardIcon class="mx-auto" size={36} /></svelte:fragment>
      		<span>Dashboard</span>
      	</AppRailTile>
      	<AppRailTile bind:group={currentSidebar} name="tile-2" value={1} title="tile-2">
      		<svelte:fragment slot="lead">
            <ReceiptIcon class="mx-auto" size={36}/>
          </svelte:fragment>
      		<span>Bills</span>
      	</AppRailTile>
      	<AppRailTile bind:group={currentSidebar} name="tile-3" value={2} title="tile-3">
      		<svelte:fragment slot="lead">
            <CreditCardIcon size={36} class="mx-auto" />
          </svelte:fragment>
      		<span>Payments</span>
      	</AppRailTile>
      	<!-- --- -->
      	<svelte:fragment slot="trail">
      		<AppRailAnchor href="/" target="_blank" title="Account">(icon)</AppRailAnchor>
      	</svelte:fragment>
      </AppRail>
    </aside>
    <section class="flex-grow">
      <div class="container mx-auto">
        
        <section class="alert variant-ghost-tertiary my-3">
          <div class="alert-message">You have {upcoming.length} upcoming bills</div>
          <footer class="alert-actions">(buttons)</footer>
        </section>
        <Header>Dashboard</Header>
        <Header tag="h2" color="secondary">Past Due</Header>
        <div class="flex flex-col gap-4">
          {#each data.groupings.past as { bills, household}}
            <div class="card variant-ghost-error">
              <header class="card-header">
                {bills.billName}
              </header>
            </div>
          {/each}
        </div>
        <Header class={data.groupings.past.length > 0 ? 'mt-4' : undefined} tag="h2" color="secondary">Upcoming</Header>
        <main class="flex flex-col gap-4">
          {#each data.groupings.upcoming as { bills, household }}
            <article class="card variant-ghost-primary">
              <Header tag="h3" class="card-header" color="secondary">
                {bills.billName} <small>&ndash; {bills.dueDate} ({relativeParser.format(bills.dueDate - today.getDate(), 'days')})</small>
              </Header>
              <section class="p-4">
                <strong>{household.name}</strong> Household
              </section>
              <footer class="card-footer flex gap-2">
                <button class="btn btn-sm variant-filled-primary">
                  Paid
                  <!-- Defer to anothe day, paid, missed? -->
                  <!-- Need notes -->
                </button>
              </footer>
            </article>
          {/each}
        </main>
        <Header tag="h2" color="secondary">Coming Soon</Header>
        <div class="grid grid-cols-2 gap-3">
          {#each data.groupings.comingSoon as { bills, household}}
            <div class="card variant-ghost-primary">
              <header class="card-header">
                {bills.billName} - {household.name}
              </header>
            </div>
        
          {:else}
            <div class="card variant-ghost-success col-span-2">
              <header class="card-header">
                No Upcoming Bills this month
              </header>
            </div>
          {/each}
        </div>
        <Header class="mt-4" tag="h2" color="secondary">
          Paid
        </Header>
        list of paid stuff
      </div>
    </section>
  </div>
