import React, { useState } from 'react'
import { Modal } from './components/Modal'
import { Tabs } from './components/Tabs'
import { Disclosure } from './components/Disclosure'


export default function Playground() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const sampleTabs = [
    {
      id: 'tab1',
      label: 'Overview',
      content: (
        <p className="p-4">
          This is the Overview panel. Try using left and right arrow keys to
          switch tabs.
        </p>
      ),
    },
    {
      id: 'tab2',
      label: 'Details',
      content: (
        <p className="p-4">
          This is the Details panel focused strictly via W3C APG patterns.
        </p>
      ),
    },
    {
      id: 'tab3',
      label: 'Settings',
      content: (
        <p className="p-4">
          This is the Settings panel with roving tabindex applied.
        </p>
      ),
    },
  ]

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-10">
      <h1 className="text-2xl font-bold border-b pb-2">
        A11y Foundations Playground
      </h1>

      {/* 1. Modal Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Modal Dialog</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          Open Accessible Modal
        </button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Keyboard-Accessible Modal"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Focus is trapped inside this modal. Pressing Escape or clicking
              close will restore focus to the trigger button.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 border rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      </section>

      {/* 2. Tabs Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Accessible Tabs</h2>
        <Tabs tabs={sampleTabs} />
      </section>

      {/* 3. Disclosure Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Disclosure Component</h2>
        <Disclosure buttonText="What makes this disclosure accessible?">
          It uses `aria-expanded` to communicate toggle state to screen readers
          and connects the trigger to the content panel via `aria-controls`.
        </Disclosure>
      </section>
    </div>
  )
}
