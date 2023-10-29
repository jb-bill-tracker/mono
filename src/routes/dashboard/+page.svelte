<script lang="ts">
  import Header from "$lib/components/header/header.svelte";
  import { Accordion, AccordionItem, Step, Stepper } from "@skeletonlabs/skeleton";
  import { PlusIcon } from "lucide-svelte";
  export let data;

  const today = new Date();

  const relativeParser = new Intl.RelativeTimeFormat(undefined, {
    style: "long",
    numeric: "auto",
  });

  let upcoming = data.bills.filter(
    (f) => Math.abs(f.bills.dueDate - today.getDate()) < 5
  );
  /**
   * UPCOMING < 5
   * COMING SOON < 10
   * PAID - status===paid
   * PAST - status !== paid && dueDate < currentDate
   */

  let dialogOpen = false;
</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

<Header class="mt-4">
  Dashboard
  <svelte:fragment slot="actions">
    <button
      class="btn variant-filled-primary btn-sm"
      on:click={() => {
        /** @type {HTMLDialogElement} */
        const el = document.getElementById("add-bill-ui");
        if (!el) return;
        el.showModal();
      }}><PlusIcon />New Bill</button
    >
  </svelte:fragment>
</Header>

<dialog class="bg-surface-800 w-10/12 text-white p-4 rounded backdrop:bg-zinc-900/40" id="add-bill-ui">
  <form on:invalid={e => console.info('FUCK', e)}>
    <Stepper>
      <Step>
        <svelte:fragment slot="header">Bill Information</svelte:fragment>
        <input
          class="px-2 input"
          type="text"
          name="bill-name"
          placeholder="Name of the bill"
          required
        />
        <input class="px-2 input" placeholder="1" type="number" min="1" max="31" required />
      </Step>
      <Step>
        <svelte:fragment slot="header">Household</svelte:fragment>
        Step 2 content
      </Step>
    </Stepper>
  </form>
</dialog>


<div class="">
  <Accordion class="flex flex-col gap-2">
    <AccordionItem open class="card variant-soft-surface">
      <svelte:fragment slot="summary">
        <Header tag="h3" color="secondary">
          Past Due
        </Header>
      </svelte:fragment>
      <svelte:fragment slot="content">
        <section class="p-4">
          List of past due bills here
        </section>
      </svelte:fragment>
    </AccordionItem>
    <AccordionItem open class="card variant-soft-surface">
      <svelte:fragment slot="summary">
        <Header tag="h3" color="secondary">
          Upcoming
        </Header>
      </svelte:fragment>
      <svelte:fragment slot="content">
        <div class="flex flex-col gap-4">
          {#each data.groupings.upcoming as { bills, household }}
            <div class="card variant-ghost-primary">
              <Header tag="h4" class="card-header">
                {bills.billName} due on {bills.dueDate}
              </Header>
              <section class="p-4">
                Other relevant information
              </section>
  
            </div>
            {:else}
            No Upcoming bills
          {/each}
        </div>
      </svelte:fragment>
    </AccordionItem>
    <AccordionItem open={data.groupings.comingSoon.length > 0} class="card variant-soft-surface">
      <svelte:fragment slot="summary">
        <Header tag="h3" color="secondary">
          Coming Soon
        </Header>
      </svelte:fragment>
      <svelte:fragment slot="content">
        <div class="flex flex-col gap-2">
          {#each data.groupings.comingSoon as {bills, household}}
            {bills.billName}
          {:else}
            <p>No bills coming soon</p>
          {/each}
        </div>
      </svelte:fragment>
    </AccordionItem>
    <AccordionItem open={data.groupings.paid.length > 0} class="card variant-soft-surface">
      <svelte:fragment slot="summary">
        <Header tag="h3" color="secondary">
          Paid
        </Header>
      </svelte:fragment>
      <svelte:fragment slot="content">
        <div class="grid grid-cols-3 gap-32">
          {#each data.groupings.paid as {bills, household}}
            <div class="card variant-filled-primary">
              <header class="card-header p-4">
                {bills.billName} - due on {bills.dueDate}
              </header>
            </div>
          {/each}
        </div>
      </svelte:fragment>
    </AccordionItem>
  </Accordion>
</div>