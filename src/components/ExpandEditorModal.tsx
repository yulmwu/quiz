import { PropsWithChildren } from 'react'

interface ExpandEditorModalProps extends PropsWithChildren {
    open: boolean
}

const ExpandEditorModal = ({ open, children }: ExpandEditorModalProps) => {
    return (
        <div className={`fixed inset-0 z-50 bg-black/60 ${open ? 'flex items-center justify-center' : 'hidden'}`}>
            {open && (
                <div className='w-[90%] max-w-[1280px] mx-auto bg-white rounded-xl overflow-hidden'>
                    <div className='px-4 py-4 border-t border-b border-gray-300'>{children}</div>
                </div>
            )}
        </div>
    )
}

export default ExpandEditorModal
