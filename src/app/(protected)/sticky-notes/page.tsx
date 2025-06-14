import AddStickyNoteForm from '@/components/sticky-notes/StickyNoteForm'
import StickyNotesComp from '@/components/sticky-notes/StickyNotesComp'
import React from 'react'

function StickyNotes() {
  return (
    <div>
      <AddStickyNoteForm />
      <StickyNotesComp />
    </div>
  )
}

export default StickyNotes