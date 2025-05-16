// linkedList.ts
export class ListNode {
    value: string;
    next: ListNode | null = null;

    constructor(value: string) {
        this.value = value;
    }
}

export class LinkedList {
    head: ListNode | null = null;

    insertAtEnd(value: string) {
        const newNode = new ListNode(value);
        if (!this.head) {
            this.head = newNode;
            return;
        }

        let curr = this.head;
        while (curr.next) curr = curr.next;
        curr.next = newNode;
    }

    insertAtHead(value: string) {
        const newNode = new ListNode(value);
        newNode.next = this.head;
        this.head = newNode;
    }

    deleteFromHead() {
        if (this.head) {
            this.head = this.head.next;
        }
    }

    deleteByValue(value: string) {
        if (!this.head) return;
        if (this.head.value === value) {
            this.head = this.head.next;
            return;
        }

        let curr = this.head;
        while (curr.next && curr.next.value !== value) {
            curr = curr.next;
        }
        if (curr.next) {
            curr.next = curr.next.next;
        }
    }

    toArray(): string[] {
        const nodes: string[] = [];
        let curr = this.head;
        while (curr) {
            nodes.push(curr.value);
            curr = curr.next;
        }
        return nodes;
    }

    reverse() {
        let prev: ListNode | null = null;
        let current = this.head;

        while (current !== null) {
            const next = current.next;   // save next
            current.next = prev;         // reverse the pointer
            prev = current;              // move prev forward
            current = next;              // move current forward
        }

        this.head = prev;
    }
}
